import { useNavigate } from "react-router-dom";
const Referral = (props) => {
  const { referral, ind } = props;
  const { id, name, serviceName, date, profit } = referral;
  const style = ind % 2 == 0 ? "odd-style" : "even-style";
  const navigate = useNavigate();
  return (
    <tr onClick={() => navigate(`/referral/${id}`)} className={style}>
      <td>{name}</td>
      <td>{serviceName}</td>
      <td>{date}</td>
      <td>{profit}</td>
    </tr>
  );
};

export default Referral;
