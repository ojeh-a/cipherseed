type Props = {
    label: string;
    value: string;
    onChange: (val: string) => void
};

export const TextArea = ({label, value, onChange}: Props) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <textarea
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2"
        />
    </div>
)