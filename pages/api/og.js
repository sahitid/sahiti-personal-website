import { ImageResponse } from '@vercel/og';

export const config = {
    runtime: 'edge',
};

export default function handler(req) {
    try {
        const { searchParams } = new URL(req.url);

        // Get dynamic content from query params (optional)
        const title = searchParams.get('title') || 'SAHITI DASARI.';
        const description = searchParams.get('description') || 'Student & developer in love with storytelling through technology and entrepreneurship.';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backgroundColor: '#FFEBEB',
                        padding: '80px',
                        fontFamily: 'Inter',
                    }}
                >
                    {/* Boat icon */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '40px',
                            left: '40px',
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#FF4444',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#FFEBEB',
                                borderRadius: '50%',
                            }}
                        />
                    </div>

                    {/* Main title */}
                    <div
                        style={{
                            fontSize: '72px',
                            fontWeight: 'bold',
                            color: '#FF4444',
                            lineHeight: '1.1',
                            marginBottom: '24px',
                            letterSpacing: '2px',
                        }}
                    >
                        {title}
                    </div>

                    {/* Description */}
                    <div
                        style={{
                            fontSize: '24px',
                            color: '#2F0000',
                            lineHeight: '1.4',
                            maxWidth: '900px',
                            marginBottom: '32px',
                            letterSpacing: '1px',
                        }}
                    >
                        {description}
                    </div>

                    {/* Mission statement */}
                    <div
                        style={{
                            fontSize: '20px',
                            color: '#2F0000',
                            lineHeight: '1.4',
                            maxWidth: '900px',
                            fontStyle: 'italic',
                        }}
                    >
                        Mission: to make an impact by spreading opportunities.
                    </div>

                    {/* Bottom border */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '80px',
                            right: '80px',
                            height: '4px',
                            backgroundColor: '#FF4444',
                        }}
                    />

                    {/* Contact info */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: '80px',
                            fontSize: '18px',
                            color: '#FF4444',
                            fontWeight: '500',
                        }}
                    >
                        sahitidasari@outlook.com
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
} 