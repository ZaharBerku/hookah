export type InfoUser = {
  profile: Profile;
  wallet_amount: number;
  wallet_reserved_amount: number;
};

export type Profile = {
  name: string;
  email: string;
  avatar_url: any;
};

export type AuctionType = {
  id?: number;
  title: string;
  description: string;
  min_bid: string;
  min_bid_diff: string;
  bid_type: string;
  status: "draft" | "active" | "completed" | "upcoming" | "canceled";
  start_date: string;
  main_image: any;
  end_date: string;
  winner_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};
