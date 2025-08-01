package com.mood_tracker.app

import android.os.Bundle
import androidx.core.view.WindowCompat

class MainActivity : TauriActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        window.statusBarColor = android.graphics.Color.TRANSPARENT
        
        window.navigationBarColor = android.graphics.Color.TRANSPARENT
    }
}