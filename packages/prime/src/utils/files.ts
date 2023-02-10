import heic2any from "heic2any";

export const isHEICFile = (file: File): boolean => {
    return (
        file.type.toLowerCase() === "image/heic" ||
        file.name.toLowerCase().includes(".heic")
    );
};

export const convertHeic = async (file: File): Promise<File> => {
    const blob = await heic2any({
        blob: file,
        toType: `image/png`,
        quality: 1,
    });
    return new File(
        Array.isArray(blob) ? blob : [blob],
        file.name.replace("heic", "png"),
        {
            type: `image/png`,
        }
    );
};
