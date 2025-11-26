import { RowValueRangeDto } from "~/application/dtos/entities/RowValueRangeDto";
import { NumberFormatType } from "~/utils/shared/NumberUtils";
import RowNumberCell from "./RowNumberCell";

interface Props {
  value: RowValueRangeDto;
  format?: NumberFormatType;
  currencySymbol?: string;
}
export default function RowRangeNumberCell({ value, format, currencySymbol }: Readonly<Props>) {
  const minValue = value?.numberMin !== undefined && value?.numberMin !== null ? Number(value.numberMin) : undefined;
  const maxValue = value?.numberMax !== undefined && value?.numberMax !== null ? Number(value.numberMax) : undefined;

  return (
    <div className="flex items-center space-x-1">
      <RowNumberCell value={minValue} format={format} currencySymbol={currencySymbol} />
      <div className="text-muted-foreground">-</div>
      <RowNumberCell value={maxValue} format={format} currencySymbol={currencySymbol} />
    </div>
  );
}
