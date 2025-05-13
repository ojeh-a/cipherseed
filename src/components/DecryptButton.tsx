'use client'

import { useState } from "react";

interface DecryptButtonProps {
    onDecrypt: () => void;
    disabled?: boolean;
}

export default function DecryptButton({onDecrypt, disabled}: DecryptButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true);
        try {
            await onDecrypt();
        } finally {
            setLoading(false);
        }
    };

    return (
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
      >
        <span>🔓</span>
        {loading ? "Decrypting..." : "Decrypt"}
      </button>
    );
}