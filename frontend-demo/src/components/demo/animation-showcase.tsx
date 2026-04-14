"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tabs = [
  { id: "mentor", label: "Mentor mode" },
  { id: "hints", label: "Hints mode" },
  { id: "checker", label: "Checker mode" },
] as const;

const features = [
  "staggered cards",
  "layout animations",
  "animated modal",
  "active tab indicator",
];

export function AnimationShowcase() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("mentor");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const content = useMemo(() => {
    switch (activeTab) {
      case "mentor":
        return "Режим mentor подойдёт для подробных объяснений и пошагового разбора решения.";
      case "hints":
        return "Режим hints должен подталкивать к ответу, но не раскрывать решение сразу.";
      case "checker":
        return "Режим checker полезен, когда AI только валидирует и объясняет ошибки.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="stack-lg">
      <Card>
        <div className="stack-md">
          <div className="row between gap-sm wrap">
            <div>
              <h3>Сложные примеры анимаций</h3>
              <p className="muted">
                Здесь собраны паттерны, которые реально могут пригодиться в дипломе.
              </p>
            </div>
            <Button type="button" onClick={() => setIsModalOpen(true)}>
              Открыть модалку
            </Button>
          </div>

          <LayoutGroup>
            <div className="tab-row">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    className="tab-button"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="active-tab"
                        className="tab-button-active-bg"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    ) : null}
                    <span className="tab-button-label">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="animated-panel"
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>

      <div className="stats-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card>
              <div className="stack-sm">
                <span className="badge">пример {index + 1}</span>
                <h3>{feature}</h3>
                <p className="muted">
                  Такие анимации помогают интерфейсу быть живым, но не перегруженным.
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen ? (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="stack-md">
                <div className="stack-sm">
                  <h3>Модалка для AI-помощника</h3>
                  <p className="muted">
                    Такой компонент может стать основой для чата помощника, подтверждения действий
                    или предпросмотра урока.
                  </p>
                </div>

                <div className="helper-box">
                  <p>Идея для диплома:</p>
                  <ul>
                    <li>открывать режим mentor/hints/checker без смены страницы;</li>
                    <li>показывать прогресс решения;</li>
                    <li>анимировать смену состояния проверки.</li>
                  </ul>
                </div>

                <div className="row gap-sm">
                  <Button type="button" onClick={() => setIsModalOpen(false)}>
                    Понял
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Закрыть
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
