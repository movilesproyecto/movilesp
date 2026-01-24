import React from 'react';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { View } from 'react-native';

export default function ConfirmDialog({
  visible,
  title = 'Confirmar',
  message = '¿Estás seguro?',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isDangerous = false,
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>{cancelText}</Button>
          <Button
            onPress={onConfirm}
            textColor={isDangerous ? '#EF4444' : undefined}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
