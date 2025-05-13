'use client'

import { useState } from "react";

interface EncryptButtonProps {
    onEncrypt: () => void;
    disabled?: boolean;
}

export default function EncryptButton({onEncrypt, disabled}: EncryptButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true);
        try {
            await onEncrypt();
        } finally {
            setLoading(false);
        }
    };

    return (
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        <span>🔐</span>
        {loading ? "Encrypting..." : "Encrypt"}
      </button>
    );
}