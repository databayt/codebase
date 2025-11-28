
const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-screen max-w-sm mx-auto flex items-center justify-center px-responsive">
      {children}
    </div>
   );
}
 
export default AuthLayout;