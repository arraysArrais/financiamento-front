import { useLottie } from "lottie-react";
import squirtleOriginal from './squirtle_original.json'

export const SquirtleLoading = () => {
    const style = {
        height: 300
    }
    const options = {
        animationData: squirtleOriginal,
        loop: true,
    };

    const { View } = useLottie(options, style);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 200
        }}>
            {View}
        </div>
    )
}