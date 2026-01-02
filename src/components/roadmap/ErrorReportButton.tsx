import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Send } from 'lucide-react';
import { api } from '@/services/api';

interface ErrorReportButtonProps {
  entityType: 'event' | 'ipo' | 'founder' | 'company' | 'financial' | 'ma';
  entityId: string;
  entityTitle: string;
}

export const ErrorReportButton = ({ entityType, entityId, entityTitle }: ErrorReportButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorType, setErrorType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const { toast } = useToast();

  const entityTypeLabels: Record<string, string> = {
    event: 'Событие',
    ipo: 'IPO/SPO',
    founder: 'Основатель',
    company: 'Компания',
    financial: 'Финансовые данные',
    ma: 'M&A сделка',
  };

  const errorTypes = [
    { value: 'incorrect_date', label: 'Неверная дата' },
    { value: 'incorrect_name', label: 'Ошибка в названии/имени' },
    { value: 'incorrect_data', label: 'Неверные данные' },
    { value: 'missing_info', label: 'Отсутствует информация' },
    { value: 'duplicate', label: 'Дубликат записи' },
    { value: 'other', label: 'Другое' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!errorType || !description.trim()) {
      toast({
        title: 'Заполните все поля',
        description: 'Выберите тип ошибки и опишите проблему',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createErrorReport({
        entity_type: entityType,
        entity_id: entityId,
        entity_title: entityTitle,
        error_type: errorType,
        description: description.trim(),
        contact_email: contactEmail.trim() || undefined,
      });

      toast({
        title: 'Сообщение отправлено',
        description: 'Спасибо! Администратор рассмотрит ваше сообщение об ошибке.',
      });

      setOpen(false);
      setErrorType('');
      setDescription('');
      setContactEmail('');
    } catch (error) {
      toast({
        title: 'Ошибка отправки',
        description: 'Не удалось отправить сообщение. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-muted-foreground hover:text-destructive"
          title="Сообщить об ошибке"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Сообщить об ошибке
          </DialogTitle>
          <DialogDescription>
            {entityTypeLabels[entityType]}: <strong>{entityTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="errorType">Тип ошибки *</Label>
            <Select value={errorType} onValueChange={setErrorType}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип ошибки" />
              </SelectTrigger>
              <SelectContent>
                {errorTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание ошибки *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите, что именно неверно и как должно быть правильно..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email для связи (необязательно)</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              'Отправка...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Отправить
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
