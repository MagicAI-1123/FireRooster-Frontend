import styles from "./authLayout.module.scss";
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authHeader}>
        <Image 
          src="/logo.png" 
          alt="Logo"
          width={150}  // adjust based on your logo size
          height={50}  // adjust based on your logo size
          priority
        />
      </div>
      {children}
    </div>
  );
}
