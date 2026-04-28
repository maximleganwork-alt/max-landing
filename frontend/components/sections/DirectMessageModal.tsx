"use client";

import { MessageCircle, Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { reachGoal } from "@/lib/analytics";

interface DirectMessageModalProps {
  open: boolean;
  onClose: () => void;
}

const MAX_USERNAME = "@botmax_studio";
const TG_USERNAME = "@botmax_studio_tg";
const MAX_URL = "https://max.ru/@botmax_studio";
const TG_URL = "https://t.me/botmax_studio_tg";

export function DirectMessageModal({ open, onClose }: DirectMessageModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Написать напрямую"
      description="Выберите удобный мессенджер — мы ответим в рабочее время в течение 30 минут."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href={MAX_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => reachGoal("direct_message_click_max")}
          className="group flex flex-col items-start gap-3 rounded-[var(--radius)] border border-border bg-bg-card p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-white">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-body font-semibold text-fg">Написать в MAX</p>
            <p className="mt-1 text-caption text-fg-subtle">{MAX_USERNAME}</p>
          </div>
        </a>

        <a
          href={TG_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => reachGoal("direct_message_click_telegram")}
          className="group flex flex-col items-start gap-3 rounded-[var(--radius)] border border-border bg-bg-card p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#229ED9] text-white">
            <Send className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-body font-semibold text-fg">Написать в Telegram</p>
            <p className="mt-1 text-caption text-fg-subtle">{TG_USERNAME}</p>
          </div>
        </a>
      </div>
    </Modal>
  );
}
