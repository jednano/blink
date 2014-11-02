interface BackgroundOptions {
    /**
     * Initial value: scroll
     *
     * If specified, determines whether that image's position is fixed within
     * the viewport, or scrolls along with its containing block.
     */
    attachment?: string;
    /**
     * Initial value: border-box
     * Support: IE 9+
     *
     * Specifies whether an element's background, either the color or image,
     * extends underneath its border.
     *
     * If no background image or color is set, this property will only have a
     * visual effect when the border has transparent regions or partially opaque
     * regions (due to border-style or border-image); otherwise the border
     * covers up the difference.
     */
    clip?: string;
    /**
     * Initial value: transparent
     *
     * Sets the background color of an element, either through a color value
     * or the keyword transparent.
     */
    color?: string;
    /**
     * Initial value: none
     *
     * Sets one or several background images for an element. The images are
     * drawn on stacking context layers on top of each other. The first layer
     * specified is drawn as if it is closest to the user. The borders of the
     * element are then drawn on top of them, and the background-color is drawn
     * beneath them.
     *
     * How the images are drawn relative to the box and its borders is defined
     * by the background-clip and background-origin CSS properties.
     *
     * If a specified image cannot be drawn (e.g., when the file denoted by the
     * specified URI cannot be loaded), browsers handle it as they would a
     * none value.
     *
     * Note: Even if the images are opaque and the color won't be displayed in
     * normal circumstances, web developers should always specify a
     * background-color. If the images cannot be loaded—for instance, when the
     * network is down—the background color will be used as a fallback.
     */
    image?: string;
    /**
     * Initial value: padding-box
     * Support: IE 9+
     *
     * Determines the background positioning area, that is the position of the
     * origin of an image specified using the background-image CSS property.
     *
     * Note that background-origin is ignored when background-attachment is
     * fixed.
     *
     * If the value of this property is not set in a background shorthand
     * property that is applied to the element after the background-origin CSS
     * property, the value of this property is then reset to its initial value
     * by the shorthand property.
     */
    origin?: string;
    /**
     * Initial value: 0% 0%
     *
     * Sets the initial position, relative to the background position layer
     * defined by background-origin for each defined background image.
     */
    position?: any;
    /**
     * Initial value: repeat
     *
     * Defines how background images are repeated. A background image can be
     * repeated along the horizontal axis, the vertical axis, both axes, or not
     * repeated at all.
     *
     * By default, the repeated images are clipped to the size of the element,
     * but they can be scaled to fit (using round) or evenly distributed from
     * end to end (using space).
     */
    repeat?: string;
    /**
     * Initial value: auto auto
     * Support: IE 9+
     *
     * Specifies the size of the background images. The size of the image can be
     * fully constrained or only partially in order to preserve its intrinsic
     * ratio.
     *
     * Note: If the value of this property is not set in a background shorthand
     * property that is applied to the element after the background-size CSS
     * property, the value of this property is then reset to its initial value
     * by the shorthand property.
     */
    size?: string;
}
export = BackgroundOptions;
