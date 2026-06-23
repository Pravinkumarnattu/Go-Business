import {
  DollarSign,
  CreditCard,
  Link2,
  Hourglass,
  Percent,
  Coins,
  Users,
  ArrowLeftRight,
  HelpCircle,
} from "lucide-react";

const iconMap = {
  balance: DollarSign,
  discountPct: CreditCard,
  totalRef: Link2,
  discountAmt: Hourglass,
  commissionAmt: Percent,
  totalEarn: Coins,
  commissionDisc: Users,
  bankTransfer: ArrowLeftRight,
};

const OverviewCard = ({ metric }) => {
  const { value, label, id } = metric;
  const Icon = iconMap[id] || HelpCircle;

  return (
    <div className="metric-card">
      <div className="metric-icon">
        <Icon size={18} color="#ffffff" />
      </div>
      <h2 className="metric-value">{value}</h2>
      <p className="metric-label">{label}</p>
    </div>
  );
};

export default OverviewCard;
