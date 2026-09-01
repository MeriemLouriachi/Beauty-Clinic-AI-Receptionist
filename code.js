// ─── Step 1: Get the incoming data ───
const body = items[0].json;
const entry = body.entry?.[0];
const messagingEvent = entry?.messaging?.[0];

if (!messagingEvent) {
  return [{ json: { status: 'invalid', reason: 'missing_messaging_event', raw: body } }];
}

// ─── Step 2: Classify the event type ───
function classifyEvent(msg) {
  if (msg.message?.is_echo) return 'echo';
  if (msg.message?.is_deleted) return 'deleted';
  if (msg.message?.is_unsupported) return 'unsupported';
  if (msg.message?.quick_reply) return 'quick_reply';
  if (msg.message?.attachments) return 'attachment';
  if (msg.reply_to?.story) return 'story_reply';
  if (msg.referral?.product) return 'shop_referral';
  if (msg.referral?.ad_id) return 'ad_referral';
  if (msg.message?.text) return 'text';
  return 'unknown';
}

const eventType = classifyEvent(messagingEvent);

// ─── Step 3: Route by type ───
switch (eventType) {

  case 'text': {
    // YOUR JOB:
    // 1. Extract customer_id, message, timestamp, mid from messagingEvent
    // 2. Check if any are missing — if so, return status: 'invalid'
    // 3. If all present, return status: 'valid' with the four fields

  }

  case 'echo':
    return [{ json: { status: 'ignored', reason: 'own_message_echo', eventType, raw: messagingEvent } }];

  // Deferred — recognized but not implemented yet:
  case 'deleted':
  case 'unsupported':
  case 'quick_reply':
  case 'attachment':
  case 'story_reply':
  case 'shop_referral':
  case 'ad_referral':
    return [{ json: { status: 'deferred', reason: `${eventType}_not_yet_implemented`, eventType, raw: messagingEvent } }];

  default:
    return [{ json: { status: 'invalid', reason: 'unrecognized_event_shape', eventType, raw: messagingEvent } }];
}