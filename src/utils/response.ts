/**
 * Custom JSON replacer to handle BigInt serialization
 */
function bigIntReplacer(_key: string, value: any) {
    if (typeof value === "bigint") {
        return value.toString();
    }
    return value;
}

export function successResponse(message: string, data?: any) {
    const response = {
        message,
        ...(data && {data}),
    };
    // Serialize and deserialize to handle BigInt values
    return JSON.parse(JSON.stringify(response, bigIntReplacer));
}