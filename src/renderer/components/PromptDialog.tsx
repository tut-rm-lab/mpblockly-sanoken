import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@mui/material';
import { useCallback, type FormEvent } from 'react';

interface PromptDialogProps {
  open: boolean;
  message: string;
  defaultValue: string;
  onSubmit: (result: string) => void;
  onCancel: () => void;
}

export function PromptDialog({
  open,
  message,
  defaultValue,
  onSubmit,
  onCancel,
}: PromptDialogProps) {
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const result = new FormData(event.currentTarget)
        .get('result')
        ?.toString();
      if (result != null) {
        onSubmit(result);
      }
    },
    [onSubmit],
  );

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>{message}</DialogContentText>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            variant="standard"
            name="result"
            defaultValue={defaultValue}
            required
            autoFocus
          />
          <DialogActions>
            <Button onClick={onCancel}>キャンセル</Button>
            <Button type="submit">OK</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
