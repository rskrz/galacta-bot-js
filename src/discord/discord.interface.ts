export interface DiscordEntitlement {
  id: string;
  sku_id: string;
  application_id: string;
  user_id: string;
  deleted: false;
  starts_at: string;
  ends_at: string | null;
  type: number;
  gift_code_flags: number;
  promotion_id: string | null;
}
