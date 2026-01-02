import { useState, useEffect, useMemo } from 'react';
import { api, ApiError } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Check, X, Clock, MessageSquare, Trash2 } from 'lucide-react';

interface ErrorReport {
  id: number;
  entity_type: string;
  entity_id: string;
  entity_title: string;
  error_type: string;
  description: string;
  contact_email?: string;
  status: 'new' | 'in_progress' | 'resolved' | 'rejected';
  admin_comment?: string;
  created_at: string;
  updated_at?: string;
}

const entityTypeLabels: Record<string, string> = {
  event: 'Событие',
  ipo: 'IPO/SPO',
  founder: 'Основатель',
  company: 'Компания',
  financial: 'Финансы',
  ma: 'M&A',
};

const errorTypeLabels: Record<string, string> = {
  incorrect_date: 'Неверная дата',
  incorrect_name: 'Ошибка в названии',
  incorrect_data: 'Неверные данные',
  missing_info: 'Отсутствует информация',
  duplicate: 'Дубликат',
  other: 'Другое',
};

const statusLabels: Record<string, string> = {
  new: 'Новое',
  in_progress: 'В работе',
  resolved: 'Решено',
  rejected: 'Отклонено',
};

const statusColors: Record<string, string> = {
  new: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  resolved: 'bg-green-500',
  rejected: 'bg-gray-500',
};

export const ErrorReportsTab = () => {
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ErrorReport | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await api.getErrorReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load error reports:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить сообщения об ошибках. Убедитесь, что файл error_reports.php загружен на сервер и таблица создана.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    if (filterStatus === 'all') return reports;
    return reports.filter(r => r.status === filterStatus);
  }, [reports, filterStatus]);

  const handleUpdateStatus = async (id: number, status: string) => {
    setIsUpdating(true);
    try {
      await api.updateErrorReport(id, { status, admin_comment: adminComment || undefined });
      toast({ title: 'Статус обновлён' });
      loadReports();
      setSelectedReport(null);
      setAdminComment('');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Не удалось обновить статус';
      toast({ title: 'Ошибка', description: message, variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить это сообщение об ошибке?')) return;
    try {
      await api.deleteErrorReport(id);
      toast({ title: 'Сообщение удалено' });
      loadReports();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Не удалось удалить';
      toast({ title: 'Ошибка', description: message, variant: 'destructive' });
    }
  };

  const newCount = reports.filter(r => r.status === 'new').length;
  const inProgressCount = reports.filter(r => r.status === 'in_progress').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Сообщения об ошибках
            {newCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {newCount} новых
              </Badge>
            )}
            {inProgressCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {inProgressCount} в работе
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все ({reports.length})</SelectItem>
                <SelectItem value="new">Новые ({reports.filter(r => r.status === 'new').length})</SelectItem>
                <SelectItem value="in_progress">В работе ({reports.filter(r => r.status === 'in_progress').length})</SelectItem>
                <SelectItem value="resolved">Решено ({reports.filter(r => r.status === 'resolved').length})</SelectItem>
                <SelectItem value="rejected">Отклонено ({reports.filter(r => r.status === 'rejected').length})</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={loadReports} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {reports.length === 0 
              ? 'Нет сообщений об ошибках от пользователей' 
              : 'Нет сообщений с выбранным статусом'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Дата</TableHead>
                <TableHead className="w-[100px]">Статус</TableHead>
                <TableHead className="w-[100px]">Тип</TableHead>
                <TableHead>Объект</TableHead>
                <TableHead>Ошибка</TableHead>
                <TableHead className="max-w-xs">Описание</TableHead>
                <TableHead className="text-right w-[120px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className={report.status === 'new' ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}>
                  <TableCell className="text-sm">
                    {new Date(report.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[report.status]} text-white`}>
                      {statusLabels[report.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {entityTypeLabels[report.entity_type] || report.entity_type}
                  </TableCell>
                  <TableCell className="font-medium max-w-[150px]">
                    <span className="truncate block" title={report.entity_title}>
                      {report.entity_title || report.entity_id}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {errorTypeLabels[report.error_type] || report.error_type}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm" title={report.description}>
                      {report.description}
                    </p>
                    {report.contact_email && (
                      <p className="text-xs text-muted-foreground mt-1">
                        📧 {report.contact_email}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setAdminComment(report.admin_comment || '');
                          }}
                        >
                          Обработать
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Обработка сообщения об ошибке</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Объект:</p>
                            <p className="font-medium">{report.entity_title || report.entity_id}</p>
                            <p className="text-sm text-muted-foreground">
                              {entityTypeLabels[report.entity_type]} • {errorTypeLabels[report.error_type]}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Описание проблемы:</p>
                            <p className="bg-muted p-3 rounded-md text-sm">{report.description}</p>
                          </div>
                          {report.contact_email && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Email для связи:</p>
                              <a href={`mailto:${report.contact_email}`} className="text-primary hover:underline">
                                {report.contact_email}
                              </a>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Комментарий администратора:</p>
                            <Textarea
                              value={adminComment}
                              onChange={(e) => setAdminComment(e.target.value)}
                              placeholder="Добавьте комментарий (необязательно)"
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleUpdateStatus(report.id, 'in_progress')}
                              disabled={isUpdating}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              В работу
                            </Button>
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleUpdateStatus(report.id, 'resolved')}
                              disabled={isUpdating}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Решено
                            </Button>
                            <Button
                              variant="secondary"
                              className="flex-1"
                              onClick={() => handleUpdateStatus(report.id, 'rejected')}
                              disabled={isUpdating}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Отклонить
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(report.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
