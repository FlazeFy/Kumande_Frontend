import "@testing-library/jest-dom"
import 'resize-observer-polyfill'

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}

global.localStorage = localStorageMock