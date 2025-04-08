
export function parseStringArray(value: string | null, _: unknown) {
    return (value ?? "").split(",").map(s => s.trim());
}