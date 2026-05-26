import { PrismaClient } from "@prisma/client";
import { generateDraftReply } from "./geminiService";

const prisma = new PrismaClient();

const mockPersonas = [
  {
    name: "John Doe",
    channel: "web",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
    initialMessages: [
      "Hello, I am having issues accessing my subscription billing details. It says my account is restricted.",
      "Could you please check if my payment card went through successfully? I received an email confirmation.",
      "I also need to update my billing address to 123 Tech Square, Boston, MA."
    ],
  },
  {
    name: "Sarah Jenkins",
    channel: "whatsapp",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
    initialMessages: [
      "Hi, is there an API reference for setting up custom webhook alerts on my server?",
      "I want to receive real-time notifications on Slack whenever my crawler status changes.",
      "Thanks, I will wait for your guide."
    ],
  },
  {
    name: "Alex Mercer",
    channel: "whatsapp",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    initialMessages: [
      "My order #4829 has been stuck in 'pending shipment' status for the last two days.",
      "Is there a tracking number available yet? I need this package delivered by Friday.",
      "Please let me know if I need to pay any additional customs fees."
    ],
  },
  {
    name: "Emma Watson",
    channel: "web",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma",
    initialMessages: [
      "Can I cancel my monthly subscription plan directly from my dashboard billing settings?",
      "I tried looking under the profile menu but couldn't find the cancel button.",
      "I appreciate the quick help!"
    ],
  },
  {
    name: "Liam Miller",
    channel: "whatsapp",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Liam",
    initialMessages: [
      "I keep getting a 500 internal server error when attempting to fetch my database connection strings.",
      "Here is the error code: ERR_DB_CONN_TIMEOUT. Is the PostgreSQL host online?",
      "Please let me know once this is resolved."
    ],
  },
];

/**
 * Find or create a customer to prevent duplicate entries in the database.
 */
async function findOrCreateCustomer(persona: typeof mockPersonas[0]) {
  // Try to find existing customer with the same name and channel
  const existing = await prisma.customer.findFirst({
    where: {
      name: persona.name,
      channel: persona.channel,
    },
  });

  if (existing) {
    return existing;
  }

  // Create new customer if not found
  return prisma.customer.create({
    data: {
      name: persona.name,
      channel: persona.channel,
      avatar: persona.avatar,
    },
  });
}

/**
 * Triggers a realistic simulated incoming support ticket and emits to all connected clients.
 */
export async function triggerSimulatedTicket(io: any): Promise<any> {
  try {
    // Select a random persona
    const persona = mockPersonas[Math.floor(Math.random() * mockPersonas.length)];
    // Pick a random initial message from the persona's pool
    const initialContent = persona.initialMessages[Math.floor(Math.random() * persona.initialMessages.length)];

    // Find or create customer (prevents duplicate flooding)
    const customer = await findOrCreateCustomer(persona);

    // Create Conversation
    const conversation = await prisma.conversation.create({
      data: {
        customerId: customer.id,
        status: "open",
      },
    });

    // Generate AI draft for the initial message
    const history = [{ sender: "customer", content: initialContent }];
    const draft = await generateDraftReply(history, customer.name, "friendly");

    // Create Message with draft
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "customer",
        content: initialContent,
        draftReply: draft,
      },
    });

    // Pack full ticket payload
    const ticketPayload = {
      id: conversation.id,
      status: conversation.status,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      customer: {
        id: customer.id,
        name: customer.name,
        channel: customer.channel,
        avatar: customer.avatar,
      },
      messages: [
        {
          id: message.id,
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
          draftReply: message.draftReply,
        },
      ],
    };

    // Emit event to all connected dashboard agents
    io.emit("ticket:new", ticketPayload);
    console.log(`[Simulator] New ticket from ${customer.name} via ${customer.channel}`);

    return ticketPayload;
  } catch (error) {
    console.error("[Simulator] Error generating mock ticket:", error);
    return null;
  }
}

/**
 * Automatically starts the periodic ticket generator (every 40 seconds).
 */
export function startChannelSimulator(io: any) {
  console.log("[Simulator] Periodic channel simulator started.");

  // Seed an initial ticket 3 seconds after boot so the dashboard isn't empty
  setTimeout(() => {
    triggerSimulatedTicket(io).catch((e) => console.error(e));
  }, 3000);

  // Generate a ticket every 40 seconds
  setInterval(() => {
    triggerSimulatedTicket(io).catch((e) => console.error(e));
  }, 40000);
}
