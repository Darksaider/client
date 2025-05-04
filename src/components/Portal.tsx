// components/Portal.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode; // Будь-які валідні дочірні елементи React
  targetId?: string; // ID цільового DOM-вузла (необов'язково)
}

// Використовуємо звичайну функцію замість React.FC для кращої сумісності
function Portal({
  children,
  targetId = "modal-root",
}: PortalProps): React.ReactPortal | null {
  const [mounted, setMounted] = useState<boolean>(false);
  // Типізуємо portalNode як HTMLElement або null
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Знаходимо DOM-вузол на клієнті
    const node = document.getElementById(targetId);
    if (node) {
      setPortalNode(node);
      setMounted(true);
    } else {
      console.error(
        `Portal target with id "${targetId}" not found in the DOM.`,
      );
    }

    // Функція очищення (необов'язкова, але добра практика)
    return () => {
      setMounted(false);
      // Можна додати логіку очищення, якщо портал динамічно додавав/видаляв вузли
    };
  }, [targetId]); // Перевіряємо вузол, якщо targetId зміниться

  // Рендеримо портал тільки після монтування на клієнті та знаходження вузла
  if (mounted && portalNode) {
    // createPortal повертає спеціальний тип React.ReactPortal
    return createPortal(children, portalNode);
  }

  // Повертаємо null, якщо портал ще не готовий або вузол не знайдено
  return null;
}

export default Portal;
