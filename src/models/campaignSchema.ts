import { z } from 'zod';

const campaignSchema = z.object({
  'Dur Sec': z.string(),
  Advertiser: z.string(),
  Brand: z.string(),
  'Commercial Title': z.string(),
  'Film Code': z.string(),
  'Major Category': z.string(),
  'Mid Category': z.string(),
  'Minor Category': z.string(),
  'Holding Company': z.string(),
  'Sales House': z.string(),
  Agency: z.string(),
  'TRP Copy ID': z.string(),
  'TRP Commercial ID': z.string(),
  'TRP Commercial Titles': z.string(),
  'TRP Copy First broadcast date': z.string(),
  'TRP Time Copy First broadcast': z.string(),
  'TRP Channel Copy First Aired': z.string(),
  'TRP Campaign First broadcast date': z.string(),
  'Amendment Status': z.string(),
});

export type CampaignSchema = z.infer<typeof campaignSchema>;
