"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modals";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Modal
        title="Are you sure?"
        description="This action cannot be undone."
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button disabled={isLoading} variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="destructive"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
};
