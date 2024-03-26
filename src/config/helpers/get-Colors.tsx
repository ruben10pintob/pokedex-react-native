import ImageColors from "react-native-image-colors"


export const getColorFrontImage = async(image: string) => {

    const fallback = 'grey'

    const colors = await ImageColors.getColors(image, {
        fallback
    });

    switch( colors.platform ) {

        case 'android':
            return colors.dominant ?? fallback;
        
        case 'ios':
            return colors.background ?? fallback;

        default:
            return fallback;
    }
}