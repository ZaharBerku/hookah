import {
  useState,
  useCallback,
  PointerEvent as ReactPointerEvent
} from "react";

interface UseBottomSheetReturn {
  showBottom: boolean;
  sheetHeight: number;
  handleStart: () => void;
  handleClose: () => void;
  handlePointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
}

const useBottomSheet = (onClose: () => void): UseBottomSheetReturn => {
  const [showBottom, setShowBottom] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(50);

  const handleStart = useCallback(() => {
    setSheetHeight(50);
    setShowBottom(true);
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }, []);

  const handleClose = useCallback(() => {
    document.body.style.overflow = "visible";
    document.body.style.touchAction = "auto";
    setShowBottom(false);
    onClose();
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      let startY = event.clientY;
      let newHeight = 0;

      const dragMove = (ev: MouseEvent | TouchEvent) => {
        if (ev instanceof MouseEvent) {
          const delta = startY - ev.clientY;
          newHeight = sheetHeight + (delta / window.innerHeight) * 100;
        } else if (ev instanceof TouchEvent) {
          const delta = startY - ev.touches[0].clientY;
          newHeight = sheetHeight + (delta / window.innerHeight) * 100;
        }
        newHeight = Math.max(0, Math.min(100, newHeight));
        setSheetHeight(newHeight);
      };

      const dragEnd = () => {
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("mouseup", dragEnd);
        document.removeEventListener("touchmove", dragMove);
        document.removeEventListener("touchend", dragEnd);
        if (newHeight && newHeight < 20) {
          handleClose();
        } else if (newHeight < 80) {
          setSheetHeight(50);
        } else {
          setSheetHeight(100);
        }
      };

      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);
      document.addEventListener("touchmove", dragMove);
      document.addEventListener("touchend", dragEnd);
    },
    [sheetHeight, handleClose]
  );

  return {
    showBottom,
    sheetHeight,
    handleStart,
    handleClose,
    handlePointerDown
  };
};

export { useBottomSheet };
