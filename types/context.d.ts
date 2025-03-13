interface DataContextProps {
  user: User;
  muteUser: any;
  session: Session | null;
  sessionStatus: "authenticated" | "unauthenticated" | "loading";
  settings: ISettings;
  numberOfCartProduct: number;
  setNumberOfCartProducts: React.Dispatch<React.SetStateAction<number>>;
  thisProductQuantity: number;
  setThisProductQuantity: React.Dispatch<React.SetStateAction<number>>;
}
