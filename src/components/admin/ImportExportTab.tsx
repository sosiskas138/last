import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Upload, Download, FileSpreadsheet, FileText, AlertCircle, CheckCircle2, HelpCircle, FileDown, Table } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ImportResult {
  success: number;
  errors: ValidationError[];
  skipped: number;
}

type TableType = 'companies' | 'events' | 'founders' | 'ipo' | 'financials' | 'ma_events';

interface TableConfig {
  label: string;
  description: string;
  icon: string;
  requiredFields: string[];
  fields: { name: string; label: string; type: string; required?: boolean; hint?: string }[];
}

const TABLE_CONFIGS: Record<TableType, TableConfig> = {
  companies: {
    label: 'Компании',
    description: 'Основная информация о торговых сетях',
    icon: '🏢',
    requiredFields: ['id', 'name', 'color', 'status'],
    fields: [
      { name: 'id', label: 'ID компании', type: 'string', required: true, hint: 'Уникальный код, например: magnit, pyaterochka' },
      { name: 'name', label: 'Название', type: 'string', required: true, hint: 'Полное название компании' },
      { name: 'parent_company', label: 'Головная компания', type: 'string', hint: 'ID головной компании, если есть' },
      { name: 'color', label: 'Цвет', type: 'string', required: true, hint: 'HEX цвет, например: #E31E24' },
      { name: 'status', label: 'Статус', type: 'string', required: true, hint: 'active, inactive или acquired' },
      { name: 'acquired_by', label: 'Поглощена компанией', type: 'string', hint: 'ID компании-покупателя' },
      { name: 'acquired_year', label: 'Год поглощения', type: 'number', hint: 'Например: 2021' },
    ]
  },
  events: {
    label: 'События',
    description: 'Важные события в истории компаний',
    icon: '📅',
    requiredFields: ['company_id', 'date', 'title', 'category'],
    fields: [
      { name: 'company_id', label: 'ID компании', type: 'string', required: true, hint: 'К какой компании относится' },
      { name: 'date', label: 'Дата', type: 'date', required: true, hint: 'Формат: 2023-01-15' },
      { name: 'title', label: 'Заголовок', type: 'string', required: true, hint: 'Краткое описание события' },
      { name: 'description', label: 'Описание', type: 'string', hint: 'Подробное описание' },
      { name: 'category', label: 'Категория', type: 'string', required: true, hint: 'expansion, technology, finance и др.' },
      { name: 'subcategory', label: 'Подкатегория', type: 'string', hint: 'Уточнение категории' },
    ]
  },
  founders: {
    label: 'Основатели',
    description: 'Информация об основателях и ключевых лицах',
    icon: '👤',
    requiredFields: ['company_id', 'name', 'status'],
    fields: [
      { name: 'company_id', label: 'ID компании', type: 'string', required: true, hint: 'К какой компании относится' },
      { name: 'name', label: 'Имя', type: 'string', required: true, hint: 'ФИО основателя' },
      { name: 'role', label: 'Роль', type: 'string', hint: 'Основатель, Сооснователь и т.д.' },
      { name: 'period', label: 'Период работы', type: 'string', hint: 'Например: 1994-2018' },
      { name: 'status', label: 'Статус', type: 'string', required: true, hint: 'active или inactive' },
      { name: 'ownership', label: 'Доля владения', type: 'string', hint: 'Например: 3%' },
      { name: 'background', label: 'Биография', type: 'string', hint: 'Краткая биография' },
      { name: 'current_activity', label: 'Текущая деятельность', type: 'string', hint: 'Чем занимается сейчас' },
    ]
  },
  ipo: {
    label: 'IPO/SPO',
    description: 'Информация о размещениях акций на бирже',
    icon: '📈',
    requiredFields: ['company_id', 'type', 'date'],
    fields: [
      { name: 'company_id', label: 'ID компании', type: 'string', required: true, hint: 'К какой компании относится' },
      { name: 'type', label: 'Тип размещения', type: 'string', required: true, hint: 'ipo или spo' },
      { name: 'date', label: 'Дата', type: 'date', required: true, hint: 'Формат: 2006-04-24' },
      { name: 'valuation', label: 'Оценка компании', type: 'string', hint: 'Например: $1.9 млрд' },
      { name: 'raised', label: 'Привлечено средств', type: 'string', hint: 'Сумма привлечённых средств' },
      { name: 'exchange', label: 'Биржа', type: 'string', hint: 'ММВБ, LSE и др.' },
      { name: 'ticker', label: 'Тикер', type: 'string', hint: 'Биржевой тикер, например: MGNT' },
      { name: 'price', label: 'Цена акции', type: 'string', hint: 'Цена размещения' },
    ]
  },
  financials: {
    label: 'Финансы',
    description: 'Финансовые показатели по годам и кварталам',
    icon: '💰',
    requiredFields: ['company_id', 'year'],
    fields: [
      { name: 'company_id', label: 'ID компании', type: 'string', required: true, hint: 'К какой компании относится' },
      { name: 'year', label: 'Год', type: 'number', required: true, hint: 'Например: 2023' },
      { name: 'quarter', label: 'Квартал', type: 'number', hint: 'От 1 до 4, или пусто для годовых данных' },
      { name: 'revenue', label: 'Выручка (млрд руб)', type: 'number', hint: 'Число, например: 2500' },
      { name: 'profit', label: 'Прибыль (млрд руб)', type: 'number', hint: 'Число, например: 45' },
      { name: 'margin', label: 'Маржа (%)', type: 'number', hint: 'Процент, например: 1.8' },
      { name: 'store_count', label: 'Количество магазинов', type: 'number', hint: 'Число, например: 29000' },
    ]
  },
  ma_events: {
    label: 'Сделки M&A',
    description: 'Слияния и поглощения',
    icon: '🤝',
    requiredFields: ['id', 'date', 'buyer', 'target'],
    fields: [
      { name: 'id', label: 'ID сделки', type: 'string', required: true, hint: 'Уникальный код, например: magnit-2021-dixy' },
      { name: 'date', label: 'Дата сделки', type: 'date', required: true, hint: 'Формат: 2021-07-08' },
      { name: 'buyer', label: 'Покупатель', type: 'string', required: true, hint: 'Название компании-покупателя' },
      { name: 'target', label: 'Цель покупки', type: 'string', required: true, hint: 'Название приобретаемой компании' },
      { name: 'value', label: 'Сумма сделки', type: 'string', hint: 'Например: 87.6 млрд руб' },
      { name: 'description', label: 'Описание', type: 'string', hint: 'Дополнительная информация' },
    ]
  }
};

interface ImportExportTabProps {
  onDataImported: () => void;
}

export function ImportExportTab({ onDataImported }: ImportExportTabProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Import state
  const [importTable, setImportTable] = useState<TableType>('events');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Export state
  const [exportTable, setExportTable] = useState<TableType>('events');
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [isExporting, setIsExporting] = useState(false);

  // Validation functions
  const validateDate = (value: string): boolean => {
    if (!value) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  const validateNumber = (value: any): boolean => {
    if (value === '' || value === null || value === undefined) return true;
    return !isNaN(Number(value));
  };

  const validateRow = (row: any, tableType: TableType, rowIndex: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    const config = TABLE_CONFIGS[tableType];

    // Check required fields
    for (const field of config.requiredFields) {
      if (!row[field] && row[field] !== 0) {
        const fieldConfig = config.fields.find(f => f.name === field);
        errors.push({
          row: rowIndex + 2,
          field,
          message: `Не заполнено обязательное поле "${fieldConfig?.label || field}"`,
          value: row[field]
        });
      }
    }

    // Validate field types
    for (const field of config.fields) {
      const value = row[field.name];
      if (value === '' || value === null || value === undefined) continue;

      if (field.type === 'date' && !validateDate(String(value))) {
        errors.push({
          row: rowIndex + 2,
          field: field.name,
          message: `Неверный формат даты в "${field.label}". Нужен формат: 2023-01-15`,
          value
        });
      }

      if (field.type === 'number' && !validateNumber(value)) {
        errors.push({
          row: rowIndex + 2,
          field: field.name,
          message: `"${field.label}" должно быть числом`,
          value
        });
      }
    }

    // Special validations with friendly messages
    if (tableType === 'ipo' && row.type && !['ipo', 'spo'].includes(row.type.toLowerCase())) {
      errors.push({
        row: rowIndex + 2,
        field: 'type',
        message: 'Тип размещения должен быть "ipo" или "spo"',
        value: row.type
      });
    }

    if (tableType === 'companies' && row.status && !['active', 'inactive', 'acquired'].includes(row.status.toLowerCase())) {
      errors.push({
        row: rowIndex + 2,
        field: 'status',
        message: 'Статус должен быть "active", "inactive" или "acquired"',
        value: row.status
      });
    }

    if (tableType === 'financials' && row.quarter) {
      const q = Number(row.quarter);
      if (q < 1 || q > 4) {
        errors.push({
          row: rowIndex + 2,
          field: 'quarter',
          message: 'Квартал должен быть от 1 до 4',
          value: row.quarter
        });
      }
    }

    return errors;
  };

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'YYYY-MM-DD' });
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Не удалось прочитать файл. Проверьте, что файл не повреждён.'));
        }
      };
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsBinaryString(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      toast({
        title: 'Неподдерживаемый формат',
        description: 'Загрузите файл в формате Excel (.xlsx) или CSV (.csv)',
        variant: 'destructive'
      });
      return;
    }

    setImportFile(file);
    setImportResult(null);
    setValidationErrors([]);

    try {
      const data = await parseFile(file);
      setImportPreview(data.slice(0, 5));
      
      // Validate all rows
      const errors: ValidationError[] = [];
      data.forEach((row, index) => {
        errors.push(...validateRow(row, importTable, index));
      });
      setValidationErrors(errors);
      
      if (errors.length === 0) {
        toast({
          title: 'Файл готов к загрузке',
          description: `Найдено ${data.length} записей. Все данные корректны.`
        });
      } else {
        toast({
          title: 'Найдены ошибки в данных',
          description: `Обнаружено ${errors.length} проблем. Исправьте их перед загрузкой.`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка чтения файла',
        description: String(error),
        variant: 'destructive'
      });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    setIsImporting(true);
    setImportResult(null);

    try {
      const data = await parseFile(importFile);
      
      // Re-validate before import
      const errors: ValidationError[] = [];
      data.forEach((row, index) => {
        errors.push(...validateRow(row, importTable, index));
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
        toast({
          title: 'Загрузка отменена',
          description: 'Исправьте ошибки в файле и попробуйте снова.',
          variant: 'destructive'
        });
        setIsImporting(false);
        return;
      }

      // Import data via API
      const baseUrl = api.getBaseUrl();
      if (!baseUrl) {
        throw new Error('API URL не настроен. Войдите в админ-панель заново.');
      }
      
      const response = await fetch(`${baseUrl}/import.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${api.getAuthToken()}`
        },
        body: JSON.stringify({
          table: importTable,
          data: data
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Ошибка при загрузке данных');
      }

      setImportResult({
        success: result.imported || 0,
        errors: result.errors || [],
        skipped: result.skipped || 0
      });

      toast({
        title: 'Данные успешно загружены!',
        description: `Добавлено/обновлено: ${result.imported} записей.`
      });

      onDataImported();
      setImportFile(null);
      setImportPreview([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      const errorMessage = error.message?.includes('Failed to fetch') 
        ? 'Не удалось подключиться к серверу. Проверьте, что файл import.php загружен в папку /api/ на сервере.'
        : String(error);
      toast({
        title: 'Ошибка загрузки',
        description: errorMessage,
        variant: 'destructive'
      });
    }

    setIsImporting(false);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const baseUrl = api.getBaseUrl();
      if (!baseUrl) {
        throw new Error('API URL не настроен. Войдите в админ-панель заново.');
      }

      const fetchTableData = async (table: TableType): Promise<Record<string, any>[]> => {
        switch (table) {
          case 'companies':
            return (await api.getCompanies()) as any;
          case 'events':
            return (await api.getEvents()) as any;
          case 'founders':
            return (await api.getFounders()) as any;
          case 'ipo':
            return (await api.getIPO()) as any;
          case 'financials':
            return (await api.getFinancials()) as any;
          case 'ma_events': {
            // ma.php возвращает массив сделок; приведём к полям, ожидаемым в таблице ma_events
            const rows = await api.getMA();
            return (Array.isArray(rows) ? rows : []).map((r: any) => ({
              id: r.id,
              date: r.date,
              buyer: r.buyer,
              target: r.target,
              value: r.value,
              description: r.description,
              created_at: r.created_at,
              updated_at: r.updated_at,
            }));
          }
          default:
            return [];
        }
      };

      const rows = await fetchTableData(exportTable);
      const config = TABLE_CONFIGS[exportTable];
      const headers = config.fields.map((f) => f.name);

      // нормализуем строки по известным колонкам (чтобы порядок/наличие совпадали)
      const normalizedRows = (rows || []).map((r) => {
        const out: Record<string, any> = {};
        headers.forEach((h) => {
          out[h] = r?.[h] ?? '';
        });
        return out;
      });

      const date = new Date().toISOString().split('T')[0];
      const safeLabel = config.label.replace(/\//g, '-');

      if (exportFormat === 'xlsx') {
        const ws = XLSX.utils.json_to_sheet(normalizedRows, { header: headers });
        ws['!cols'] = headers.map(() => ({ wch: 20 }));

        const wb = XLSX.utils.book_new();
        const sheetName = exportTable === 'ipo' ? 'IPO_SPO' : exportTable === 'ma_events' ? 'MA' : exportTable;
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        XLSX.writeFile(wb, `${safeLabel}_${date}.xlsx`);
      } else {
        const ws = XLSX.utils.json_to_sheet(normalizedRows, { header: headers });
        const csv = XLSX.utils.sheet_to_csv(ws, { FS: ';' });
        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${safeLabel}_${date}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      toast({
        title: 'Файл скачан',
        description: `${config.label} в формате ${exportFormat.toUpperCase()}`,
      });
    } catch (error: any) {
      const errorMessage = error?.message?.includes('Failed to fetch')
        ? 'Не удалось подключиться к серверу. Проверьте API URL и доступность эндпоинтов.'
        : String(error);
      toast({
        title: 'Ошибка выгрузки',
        description: errorMessage,
        variant: 'destructive',
      });
    }

    setIsExporting(false);
  };

  const downloadTemplate = (tableType: TableType, format: 'xlsx' | 'csv') => {
    try {
      const config = TABLE_CONFIGS[tableType];
      const headers = config.fields.map(f => f.name);
      
      // Sample data
      const sampleData = getSampleData(tableType);
      
      // Create worksheet data with headers first, then sample rows
      const wsData: (string | number)[][] = [headers];
      sampleData.forEach(row => {
        const rowData = headers.map(h => {
          const val = row[h];
          return val !== undefined && val !== null ? val : '';
        });
        wsData.push(rowData);
      });
      
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      
      // Use simple sheet name without cyrillic for better compatibility
      const sheetName = tableType === 'ipo' ? 'IPO_SPO' : 
                       tableType === 'ma_events' ? 'MA' : 
                       tableType.charAt(0).toUpperCase() + tableType.slice(1);
      
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Set column widths
      ws['!cols'] = headers.map(() => ({ wch: 20 }));
      
      // Generate filename without cyrillic
      const filename = `template_${tableType}.${format}`;
      
      XLSX.writeFile(wb, filename);
      
      toast({
        title: 'Шаблон скачан',
        description: 'Откройте файл в Excel, заполните данные и загрузите обратно.'
      });
    } catch (error) {
      console.error('Template download error:', error);
      toast({
        title: 'Ошибка скачивания шаблона',
        description: 'Попробуйте скачать в другом формате',
        variant: 'destructive'
      });
    }
  };

  const getSampleData = (tableType: TableType): Record<string, any>[] => {
    switch (tableType) {
      case 'companies':
        return [
          { id: 'magnit', name: 'Магнит', color: '#E31E24', status: 'active', parent_company: '' },
          { id: 'pyaterochka', name: 'Пятёрочка', color: '#FF0000', status: 'active', parent_company: 'x5' }
        ];
      case 'events':
        return [
          { company_id: 'magnit', date: '2023-01-15', title: 'Открытие 25000-го магазина', category: 'expansion', description: 'Юбилейное открытие' },
          { company_id: 'pyaterochka', date: '2023-03-20', title: 'Запуск экспресс-доставки', category: 'technology', description: '' }
        ];
      case 'founders':
        return [
          { company_id: 'magnit', name: 'Сергей Галицкий', role: 'Основатель', status: 'inactive', period: '1994-2018', ownership: '3%', background: '', current_activity: '' },
          { company_id: 'pyaterochka', name: 'Андрей Рогачёв', role: 'Сооснователь', status: 'inactive', period: '1999-2006', ownership: '', background: '', current_activity: '' }
        ];
      case 'ipo':
        return [
          { company_id: 'magnit', type: 'ipo', date: '2006-04-24', exchange: 'ММВБ', ticker: 'MGNT', valuation: '$1.9 млрд', raised: '', price: '' },
          { company_id: 'okey', type: 'ipo', date: '2010-11-23', exchange: 'LSE', ticker: 'OKEY', valuation: '', raised: '', price: '' }
        ];
      case 'financials':
        return [
          { company_id: 'magnit', year: 2023, quarter: 4, revenue: 2500, profit: 45, margin: 1.8, store_count: 29000 },
          { company_id: 'x5', year: 2023, quarter: '', revenue: 3200, profit: 60, margin: 1.9, store_count: 23000 }
        ];
      case 'ma_events':
        return [
          { id: 'magnit-2021-dixy', date: '2021-07-08', buyer: 'Магнит', target: 'ДИКСИ', value: '87.6 млрд руб', description: 'Покупка сети ДИКСИ' },
          { id: 'x5-2010-kopeyka', date: '2010-12-15', buyer: 'X5 Retail Group', target: 'Копейка', value: '$1.65 млрд', description: '' }
        ];
      default:
        return [];
    }
  };

  const config = TABLE_CONFIGS[importTable];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Загрузить данные
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Скачать данные
          </TabsTrigger>
        </TabsList>

        {/* IMPORT TAB */}
        <TabsContent value="import" className="space-y-6">
          {/* Step 1: Choose data type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                Выберите тип данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.entries(TABLE_CONFIGS) as [TableType, TableConfig][]).map(([key, tableConfig]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setImportTable(key);
                      setImportFile(null);
                      setImportPreview([]);
                      setValidationErrors([]);
                      setImportResult(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      importTable === key 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{tableConfig.icon}</div>
                    <div className="font-medium">{tableConfig.label}</div>
                    <div className="text-xs text-muted-foreground">{tableConfig.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Download template */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                Скачайте шаблон
              </CardTitle>
              <CardDescription>
                Шаблон содержит правильную структуру и примеры данных
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => downloadTemplate(importTable, 'xlsx')} className="flex-1">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Скачать шаблон Excel
                </Button>
                <Button variant="outline" onClick={() => downloadTemplate(importTable, 'csv')} className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Скачать шаблон CSV
                </Button>
              </div>
              
              {/* Field descriptions */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Описание полей</span>
                </div>
                <div className="grid gap-2">
                  {config.fields.map(field => (
                    <div key={field.name} className="flex items-start gap-2 text-sm">
                      <Badge variant={field.required ? "default" : "secondary"} className="text-xs shrink-0">
                        {field.name}
                      </Badge>
                      <span className="text-muted-foreground">
                        {field.label}
                        {field.required && <span className="text-destructive"> *</span>}
                        {field.hint && <span className="text-muted-foreground/70"> — {field.hint}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Upload file */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                Загрузите заполненный файл
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">
                  {importFile ? importFile.name : 'Нажмите или перетащите файл сюда'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Поддерживаются форматы .xlsx и .csv
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Preview */}
              {importPreview.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    Предпросмотр данных (первые 5 строк)
                  </Label>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(importPreview[0]).map(key => {
                            const fieldConfig = config.fields.find(f => f.name === key);
                            return (
                              <th key={key} className="px-3 py-2 text-left font-medium whitespace-nowrap">
                                {fieldConfig?.label || key}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.map((row, i) => (
                          <tr key={i} className="border-t">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="px-3 py-2 truncate max-w-[200px]">
                                {String(val || '—')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Validation errors */}
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Найдены ошибки ({validationErrors.length})</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 mt-2 space-y-1 text-sm max-h-40 overflow-y-auto">
                      {validationErrors.slice(0, 15).map((err, i) => (
                        <li key={i}>
                          <span className="font-medium">Строка {err.row}:</span> {err.message}
                        </li>
                      ))}
                      {validationErrors.length > 15 && (
                        <li className="text-muted-foreground">...и ещё {validationErrors.length - 15} ошибок</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Success result */}
              {importResult && importResult.success > 0 && (
                <Alert>
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertTitle>Загрузка завершена</AlertTitle>
                  <AlertDescription>
                    Успешно загружено: {importResult.success} записей
                    {importResult.skipped > 0 && `, пропущено: ${importResult.skipped}`}
                  </AlertDescription>
                </Alert>
              )}

              {/* Import button */}
              <Button 
                onClick={handleImport} 
                disabled={!importFile || isImporting || validationErrors.length > 0}
                className="w-full"
                size="lg"
              >
                {isImporting ? 'Загружаем данные...' : 'Загрузить в базу данных'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPORT TAB */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                Скачать данные из базы
              </CardTitle>
              <CardDescription>
                Выберите тип данных и формат файла
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Table selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.entries(TABLE_CONFIGS) as [TableType, TableConfig][]).map(([key, tableConfig]) => (
                  <button
                    key={key}
                    onClick={() => setExportTable(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      exportTable === key 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{tableConfig.icon}</div>
                    <div className="font-medium">{tableConfig.label}</div>
                  </button>
                ))}
              </div>

              {/* Format selection */}
              <div className="space-y-2">
                <Label>Формат файла</Label>
                <div className="flex gap-3">
                  <Button 
                    variant={exportFormat === 'xlsx' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('xlsx')}
                    className="flex-1"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Excel (.xlsx)
                  </Button>
                  <Button 
                    variant={exportFormat === 'csv' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('csv')}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    CSV (.csv)
                  </Button>
                </div>
              </div>

              {/* Export button */}
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="w-full"
                size="lg"
              >
                {isExporting ? 'Скачиваем...' : `Скачать ${TABLE_CONFIGS[exportTable].label}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
