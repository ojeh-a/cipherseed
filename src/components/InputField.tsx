type Props = {
    label: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
}

export const InputField = ({label, value, onChange, type = 'text'}: Props) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 border rounded-xl focus:outline-none focus:ring-2 focus-ring to-blue-500"
            />
    </div>
);