export interface UsageBasedPriceDto {
  from: number;
  to?: number;
  perUnitPrice?: number;
  flatFeePrice?: number;
  currency: string;
}
