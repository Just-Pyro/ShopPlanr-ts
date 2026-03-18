import SidebarLogo from "../assets/ShopPlanr-sidebar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface ResponsiveHeaderProp {
  openSidebar: () => void;
}

const ResponsiveHeader = ({ openSidebar: openMenu }: ResponsiveHeaderProp) => {
  return (
    <>
      <div className="responsive-header">
        <div className="text-4xl cursor-pointer" onClick={openMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <img
          src={SidebarLogo}
          alt="logo"
          className="h-18.75 flex-1 object-contain"
        />
      </div>
    </>
  );
};

export default ResponsiveHeader;
