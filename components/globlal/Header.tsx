import ThirdPartOFHeader from "./ThirdPartOFHeader";
import SecondPartOfHeader from "./SecondPartOfHeader";
import FirstPartOfHeder from "./FirstPartOfHeder";

const Header: React.FC = async () => {
  return (
    <div className={` bg-sticky top-0 z-50`}>
      <div className="container">
        <FirstPartOfHeder />
        <SecondPartOfHeader />
        <ThirdPartOFHeader />
      </div>
    </div>
  );
};

export default Header;
