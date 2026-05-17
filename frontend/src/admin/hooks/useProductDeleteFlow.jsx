import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../components/ConfirmationModal";

export function useProductDeleteFlow({ deleteProduct }) {
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [pendingProduct, setPendingProduct] = useState(null);

  const openDeleteModal = useCallback((product) => {
    setPendingProduct(product);
    setError("");
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (!deletingId) {
      setPendingProduct(null);
    }
  }, [deletingId]);

  const confirmDelete = useCallback(async () => {
    if (!pendingProduct) {
      return;
    }

    const productId = pendingProduct._id || pendingProduct.id;

    try {
      setDeletingId(productId);
      setError("");
      await deleteProduct(productId);
      toast.success(`${pendingProduct.name} deleted successfully.`);
      setPendingProduct(null);
    } catch (deleteError) {
      const message =
        deleteError.response?.data?.message ||
        deleteError.response?.data?.error ||
        deleteError.message ||
        "Failed to delete product.";
      setError(message);
      toast.error(message);
    } finally {
      setDeletingId("");
    }
  }, [deleteProduct, pendingProduct]);

  const confirmationModal = useMemo(
    () => (
      <ConfirmationModal
        isOpen={Boolean(pendingProduct)}
        title="Delete Product"
        description={
          pendingProduct
            ? `Delete "${pendingProduct.name}" from inventory? Its database record and associated product images will be removed permanently.`
            : ""
        }
        confirmLabel="Delete Product"
        confirmTone="danger"
        onConfirm={confirmDelete}
        onClose={closeDeleteModal}
        isProcessing={Boolean(deletingId)}
      />
    ),
    [closeDeleteModal, confirmDelete, deletingId, pendingProduct],
  );

  return {
    deleteError: error,
    deletingId,
    isDeleteLocked: Boolean(deletingId),
    openDeleteModal,
    confirmationModal,
  };
}
