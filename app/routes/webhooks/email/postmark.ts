import { ActionFunction } from "react-router";
import { clickedOutboundEmail, getOutboundEmail, openedOutboundEmail, updateOutboundEmail } from "~/modules/emailMarketing/db/outboundEmails.db.server";
import CrmService from "~/modules/crm/services/CrmService";

async function handleDelivery(outboundEmail: any, body: any) {
  await updateOutboundEmail(outboundEmail.id, {
    deliveredAt: new Date(body.DeliveredAt),
  });
}

async function handleBounce(outboundEmail: any, body: any) {
  await updateOutboundEmail(outboundEmail.id, {
    bouncedAt: new Date(body.DeliveredAt),
  });
}

async function handleSpamComplaint(outboundEmail: any, body: any) {
  await updateOutboundEmail(outboundEmail.id, {
    spamComplainedAt: new Date(body.DeliveredAt),
  });
}

async function handleOpen(outboundEmail: any, body: any) {
  await openedOutboundEmail(outboundEmail.id, {
    firstOpen: Boolean(body.FirstOpen),
  });
}

async function handleClick(outboundEmail: any, body: any) {
  await clickedOutboundEmail(outboundEmail.id, {
    link: body.OriginalLink,
  });
}

async function handleSubscriptionChange(outboundEmail: any, body: any) {
  if (!body.SuppressSending) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log("Unsubscribed from email: " + outboundEmail.email);
  await updateOutboundEmail(outboundEmail.id, {
    unsubscribedAt: new Date(),
  });
  if (outboundEmail.contactRowId) {
    const contact = await CrmService.getContact(outboundEmail.contactRowId);
    if (contact) {
      await CrmService.updateContact(contact.id, {
        marketingSubscriber: false,
      });
    }
  }
}

async function processPostmarkWebhook(body: any) {
  const RecordType: "Delivery" | "Bounce" | "SpamComplaint" | "Open" | "Click" | "SubscriptionChange" = body.RecordType;
  const Metadata = body.Metadata;

  if (Metadata.example === "value") {
    return Response.json({}, { status: 200 });
  }

  const outboundEmailId = Metadata.outboundEmailId;
  if (!outboundEmailId) {
    return Response.json({ error: "Metadata required: outboundEmailId", body }, { status: 404 });
  }

  const outboundEmail = await getOutboundEmail(outboundEmailId);
  // eslint-disable-next-line no-console
  console.log({ RecordType, outboundEmail });
  if (!outboundEmail) {
    return Response.json({ error: "No outbound email found with ID: " + outboundEmailId, body }, { status: 404 });
  }

  if (RecordType === "Delivery") {
    await handleDelivery(outboundEmail, body);
  } else if (RecordType === "Bounce") {
    await handleBounce(outboundEmail, body);
  } else if (RecordType === "SpamComplaint") {
    await handleSpamComplaint(outboundEmail, body);
  } else if (RecordType === "Open") {
    await handleOpen(outboundEmail, body);
  } else if (RecordType === "Click") {
    await handleClick(outboundEmail, body);
  } else if (RecordType === "SubscriptionChange") {
    await handleSubscriptionChange(outboundEmail, body);
  }

  return Response.json({}, { status: 201 });
}

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === "POST") {
      const body = await request.json();
      return processPostmarkWebhook(body);
    }
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
};
