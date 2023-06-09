export default function add(a: number, b: number) {
    if (a < 0 || b < 0) {
        return "I refuse to add negative numbers"
    }
    return a + b
}