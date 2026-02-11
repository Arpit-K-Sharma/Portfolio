import { ImageResponse } from 'next/og'
import { profileService } from "@/modules/profile";

// Route segment config
export const runtime = 'nodejs'; // Use Node.js runtime for DB access
export const revalidate = 3600; // Cache for 1 hour

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default async function Icon() {
    const profile = await profileService.getProfile();
    const name = profile?.name || "Portfolio";

    // Get initials (max 2 characters)
    const initials = name
        .split(' ')
        .filter(Boolean) // Filter empty strings
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 16,
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', // Blue to Purple gradient
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '8px', // Rounded square
                    fontWeight: 700,
                    fontFamily: 'sans-serif',
                }}
            >
                {initials}
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
