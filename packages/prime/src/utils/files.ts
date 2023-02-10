import heic2any from "heic2any";

export const isHeicFile = (file: File): boolean => {
    return (
        file.type.toLowerCase() === "image/heic" ||
        Boolean(file.name.split(".").pop()?.includes("heic"))
    );
};

export const covertHeicToPng = async (file: File): Promise<File> => {
    const blob = await heic2any({
        blob: file,
        toType: `image/png`,
        quality: 1,
    });
    return new File(
        Array.isArray(blob) ? blob : [blob],
        file.name.replace(/\.heic$/i, ".png"),
        {
            type: `image/png`,
        }
    );
};
