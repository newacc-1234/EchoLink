import {Fingerprint, Satellite} from "lucide-react";

const AuthImage = ({title,subtitle,variant}) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-7 mt-12">
      <div className="max-w-md text-center">
        <center>
          {variant === "login"? (
            <Fingerprint className="h-64 w-64 stroke-primary/100" />
          ):(
            <Satellite className="h-64 w-64 stroke-primary/100" />
          )}
        </center>

        <br />
        <br />
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImage;
