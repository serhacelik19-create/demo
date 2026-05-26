import { Conversation } from "@/lib/types";
import { formatRelativeTime } from "@/lib/timeUtils";

interface TicketItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function TicketItem({ conversation, isSelected, onSelect }: TicketItemProps) {
  const lastMsg = conversation.messages[conversation.messages.length - 1];

  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`customer-item ${isSelected ? "active" : ""}`}
    >
      <div className="avatar-wrapper">
        <img
          src={conversation.customer.avatar}
          alt={conversation.customer.name}
          className="avatar"
        />
        <div className={`channel-badge ${conversation.customer.channel === "whatsapp" ? "whatsapp" : "web"}`}>
          {conversation.customer.channel === "whatsapp" ? "WA" : "WB"}
        </div>
      </div>

      <div className="customer-info">
        <div className="customer-name-row">
          <span className="customer-name">{conversation.customer.name}</span>
          <span className={`ticket-status ${conversation.status}`}>
            {conversation.status}
          </span>
        </div>
        <span className="last-message">
          {lastMsg ? lastMsg.content : "No messages yet"}
        </span>
        {lastMsg && (
          <span className="ticket-time">
            {formatRelativeTime(lastMsg.timestamp)}
          </span>
        )}
      </div>
    </button>
  );
}
