package com.reactnativemediapicker;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class MediaPickerModule extends ReactContextBaseJavaModule {
    private static final int PICK_IMAGE = 1;
    private static final int PICK_VIDEO = 2;
    private Promise pickerPromise;
    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (pickerPromise != null) {
                if (resultCode == Activity.RESULT_OK) {
                    Uri uri = data.getData();
                    pickerPromise.resolve(uri.toString());
                } else {
                    pickerPromise.reject("PICKER_ERROR", "Media picking failed");
                }
                pickerPromise = null;
            }
        }
    };

    public MediaPickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @NonNull
    @Override
    public String getName() {
        return "MediaPicker";
    }

    @ReactMethod
    public void pickImage(Promise promise) {
        pickerPromise = promise;
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.startActivityForResult(intent, PICK_IMAGE);
        } else {
            pickerPromise.reject("NO_ACTIVITY", "Activity doesn't exist");
        }
    }

    @ReactMethod
    public void pickVideo(Promise promise) {
        pickerPromise = promise;
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Video.Media.EXTERNAL_CONTENT_URI);
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.startActivityForResult(intent, PICK_VIDEO);
        } else {
            pickerPromise.reject("NO_ACTIVITY", "Activity doesn't exist");
        }
    }
}
