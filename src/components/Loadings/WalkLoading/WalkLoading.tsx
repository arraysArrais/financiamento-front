import { useLottie } from "lottie-react";
import walk from './walk.json'

export const WalkLoading = () => {
    const style = {
        height: 300
    }
    const options = {
        animationData: walk,
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