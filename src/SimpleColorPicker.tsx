// src/SimpleColorPicker.tsx

// import { useState } from 'preact/hooks';

const SimpleColorPicker = ({ onColorChange, colors }) => {
    

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {colors.map((color, i) => (
                <div
                    key={color}
                    onClick={() => onColorChange(i - 1)}
                    style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: color,
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        borderRadius: '5px',
                        transition: 'border 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.border = '2px solid black')}
                    onMouseLeave={(e) => (e.currentTarget.style.border = '2px solid transparent')}
                />
            ))}
        </div>
    );
};

export default SimpleColorPicker;