import { useState } from "react";

type Props = {
    password: string;
    setPassword: (val: string) => void;
};

export const PasswordInput = ({password, setPassword}: Props) => {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="flex items-center">
                <input type={show ? 'text': 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-l-xl shadow-sm focus: outline-none focus:ring-2 to-blue-500"
                />
                <button
                type="button"
                onClick={() => setShow(!show)}
                className="px-3 py-2 bg-gray-200 rounded-r-xl text-sm">
                    {show ? 'Hide' : 'Show'}
                </button>
            </div>
        </div>
    );
};