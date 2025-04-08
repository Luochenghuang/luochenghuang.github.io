/**
 * Transfer Matrix Method (TMM) calculator for multilayer structures.
 * Copyright (c) 2025, Luocheng Huang
 * @module TMMCalculator
 */

/**
 * Calculates the transfer matrix for a single layer.
 * @param {number} n - Complex refractive index
 * @param {number} k - Extinction coefficient
 * @param {number} d - Thickness in nm
 * @param {number} wavelength - Wavelength in nm
 * @param {number} angle - Angle in degrees
 * @param {string} polarization - 'TE' or 'TM'
 * @returns {Array<Array<Complex>>} 2x2 transfer matrix
 */
function calculateLayerMatrix(n, k, d, wavelength, angle, polarization) {
    // Convert to SI units
    const d_m = d * 1e-9;
    const wavelength_m = wavelength * 1e-9;
    
    // Calculate wave vector components
    const k0 = 2 * Math.PI / wavelength_m;
    const kx = k0 * Math.sin(angle * Math.PI / 180);
    
    // Complex refractive index
    const n_complex = math.complex(n, k);
    
    // Calculate beta
    let beta;
    if (polarization === 'TE') {
        beta = math.sqrt(math.subtract(math.multiply(math.multiply(n_complex, n_complex), k0 * k0), math.complex(kx * kx, 0)));
    } else { // TM
        beta = math.sqrt(math.subtract(math.multiply(math.multiply(n_complex, n_complex), k0 * k0), math.complex(kx * kx, 0)));
    }
    
    // Calculate matrix elements
    const cos_beta_d = math.cos(math.multiply(beta, math.complex(d_m, 0)));
    const sin_beta_d = math.sin(math.multiply(beta, math.complex(d_m, 0)));
    
    let A, B, C, D;
    if (polarization === 'TE') {
        A = cos_beta_d;
        B = math.divide(math.multiply(sin_beta_d, math.complex(1, 0)), beta);
        C = math.multiply(math.divide(sin_beta_d, beta), math.complex(-1, 0));
        D = cos_beta_d;
    } else { // TM
        const n_squared = math.multiply(n_complex, n_complex);
        A = cos_beta_d;
        B = math.divide(math.multiply(sin_beta_d, n_squared), beta);
        C = math.multiply(math.divide(math.multiply(sin_beta_d, beta), n_squared), math.complex(-1, 0));
        D = cos_beta_d;
    }
    
    return [[A, B], [C, D]];
}

/**
 * Multiplies two 2x2 matrices of complex numbers.
 * @param {Array<Array<Complex>>} m1 - First matrix
 * @param {Array<Array<Complex>>} m2 - Second matrix
 * @returns {Array<Array<Complex>>} Product matrix
 */
function multiplyMatrices(m1, m2) {
    const A = math.add(
        math.multiply(m1[0][0], m2[0][0]),
        math.multiply(m1[0][1], m2[1][0])
    );
    const B = math.add(
        math.multiply(m1[0][0], m2[0][1]),
        math.multiply(m1[0][1], m2[1][1])
    );
    const C = math.add(
        math.multiply(m1[1][0], m2[0][0]),
        math.multiply(m1[1][1], m2[1][0])
    );
    const D = math.add(
        math.multiply(m1[1][0], m2[0][1]),
        math.multiply(m1[1][1], m2[1][1])
    );
    
    return [[A, B], [C, D]];
}

/**
 * Calculates the inverse of a 2x2 matrix of complex numbers.
 * @param {Array<Array<Complex>>} m - Matrix to invert
 * @returns {Array<Array<Complex>>} Inverted matrix
 */
function inverseMatrix(m) {
    const det = math.subtract(
        math.multiply(m[0][0], m[1][1]),
        math.multiply(m[0][1], m[1][0])
    );
    
    const A = m[1][1];
    const B = math.multiply(m[0][1], math.complex(-1, 0));
    const C = math.multiply(m[1][0], math.complex(-1, 0));
    const D = m[0][0];
    
    return [
        [math.divide(D, det), math.divide(B, det)],
        [math.divide(C, det), math.divide(A, det)]
    ];
}

/**
 * Calculates reflection and transmission coefficients for a multilayer structure.
 * @param {Array<Object>} layers - Array of layer objects with n, k, and d properties
 * @param {number} wavelength - Wavelength in nm
 * @param {number} angle - Angle in degrees
 * @param {Object} polarization - Object with TE and TM boolean flags
 * @returns {Object} Object containing R, T, and A coefficients
 */
export function calculateRT(layers, wavelength, angle, polarization) {
    // Calculate transfer matrix for each layer
    let M = [
        [math.complex(1, 0), math.complex(0, 0)],
        [math.complex(0, 0), math.complex(1, 0)]
    ];
    
    // Calculate for selected polarizations
    const polarizations = [];
    if (polarization.TE) polarizations.push('TE');
    if (polarization.TM) polarizations.push('TM');
    
    if (polarizations.length === 0) {
        return { R: 0, T: 0, A: 1 };
    }
    
    let R = math.complex(0, 0);
    let T = math.complex(0, 0);
    
    for (const pol of polarizations) {
        // Reset M for each polarization
        M = [
            [math.complex(1, 0), math.complex(0, 0)],
            [math.complex(0, 0), math.complex(1, 0)]
        ];
        
        // Multiply matrices for all layers
        for (let i = layers.length - 1; i >= 0; i--) {
            const layer = layers[i];
            const layerMatrix = calculateLayerMatrix(
                layer.n,
                layer.k,
                layer.d || 0,
                wavelength,
                angle,
                pol
            );
            M = multiplyMatrices(M, layerMatrix);
        }
        
        // Invert the final matrix
        M = inverseMatrix(M);
        
        // Get refractive indices for incident and transmitted media
        const ni = pol === 'TE' ? math.complex(1, 0) : math.complex(layers[0].n, layers[0].k);
        const nt = pol === 'TE' ? math.complex(1, 0) : math.complex(layers[layers.length - 1].n, layers[layers.length - 1].k);
        
        // Calculate beta for incident and transmitted media
        const k0 = 2 * Math.PI / (wavelength * 1e-9);
        const kx = k0 * Math.sin(angle * Math.PI / 180);
        const bi = math.sqrt(math.subtract(math.multiply(math.multiply(ni, ni), k0 * k0), math.complex(kx * kx, 0)));
        const bt = math.sqrt(math.subtract(math.multiply(math.multiply(nt, nt), k0 * k0), math.complex(kx * kx, 0)));
        
        // Calculate reflection and transmission coefficients
        const term1 = math.multiply(M[0][0], math.multiply(bi, math.multiply(nt, nt)));
        const term2 = math.multiply(M[1][1], math.multiply(bt, math.multiply(ni, ni)));
        const term3 = math.multiply(M[1][0], math.multiply(math.multiply(nt, nt), math.multiply(ni, ni)));
        const term4 = math.multiply(M[0][1], math.multiply(bi, bt));
        
        const denominator = math.subtract(
            math.add(term1, term2),
            math.multiply(math.complex(0, 1), math.subtract(term3, term4))
        );
        
        const numerator_r = math.add(
            math.multiply(math.complex(-1, 0), term1),
            math.multiply(math.complex(1, 0), term2)
        );
        
        const r = math.divide(
            math.add(
                numerator_r,
                math.multiply(math.complex(0, 1), math.add(term3, term4))
            ),
            denominator
        );
        
        const t = math.divide(
            math.multiply(math.complex(-2, 0), math.multiply(math.multiply(ni, nt), bi)),
            denominator
        );
        
        // Add to total R and T
        R = math.add(R, math.multiply(r, math.conj(r)));
        T = math.add(T, math.multiply(t, math.conj(t)));
    }
    
    // Average over selected polarizations
    R = math.divide(R, polarizations.length);
    T = math.divide(T, polarizations.length);
    
    // Calculate absorption (A = 1 - R - T)
    const R_mag = math.abs(R);
    const T_mag = math.abs(T);
    const A = 1 - R_mag - T_mag;
    
    return {
        R: math.re(R),
        T: math.abs(T),
        A: Math.max(0, A)  // Ensure A is non-negative
    };
}

/**
 * Generates an array of wavelengths for simulation.
 * @param {number} start - Start wavelength in nm
 * @param {number} end - End wavelength in nm
 * @param {number} points - Number of points
 * @returns {Array<number>} Array of wavelengths
 */
export function generateWavelengthArray(start, end, points) {
    const step = (end - start) / (points - 1);
    return Array.from({length: points}, (_, i) => start + i * step);
} 