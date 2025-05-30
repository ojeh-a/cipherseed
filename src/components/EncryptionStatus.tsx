'use client';
import { LockIcon, UnlockIcon } from "lucide-react";

export default function EncryptionStatus({isEncrypted} : {isEncrypted: boolean}) {
    return (
        <div className="flex items-center gap-2">
            {isEncrypted ? <LockIcon /> : <UnlockIcon />}
            <span>{isEncrypted ? "Encrypted" : "Unencrypted"}</span>
        </div>
    )
}