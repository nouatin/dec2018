import picamera
import datetime
import sys

camera = picamera.PiCamera()
camera.hflip = True
camera.vflip = True
camera.resolution = (2592, 1944)
camera.capture(sys.argv[1])


