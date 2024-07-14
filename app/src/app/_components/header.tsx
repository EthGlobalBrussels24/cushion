import { Button } from "~/components/ui/button";
import Link from "next/link";
import WorldIdButton from "~/app/_components/worldIdButton";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";

export function ConnectButton() {
  return <w3m-button />
}

const Header = () => {
  const router = useRouter();
  const handleCreateClick = () => {
      router.push('/create');
  };
  return (
      <header className="h-min w-full">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-xl font-bold">
            <Link href="/" passHref>
              <div className="cursor-pointer">
                <img src="/cushion.png" alt="Logo" width={150} />
              </div>
            </Link>
          </div>
          <div>
            <Button onClick={handleCreateClick}
                    className="m-4 rounded-full bg-customLightPink text-black transition-all duration-500 hover:bg-customGray hover:text-white">
              Launch a token
            </Button>
            <Button
                className="m-4 rounded-full bg-customLightPink text-black transition-all duration-500 hover:bg-customGray hover:text-white">
              Connect Wallet
            </Button>
            <ConnectButton>
            </ConnectButton>
            <w3m-button/>
            <WorldIdButton/>
          </div>
        </div>
      </header>
  );
};

export default Header;
