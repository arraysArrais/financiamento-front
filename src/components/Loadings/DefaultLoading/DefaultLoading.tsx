import { useLottie } from "lottie-react";
//import squirtleOriginal from './squirtle_original.json'
import pokeball from './pokeball.json';

export const DefaultLoading = () => {
    const style = {
        height: 150
    }
    const options = {
        animationData: pokeball,
        loop: true,
    };

    const { View } = useLottie(options, style);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 300
        }}>
            {View}
        </div>
    )
}