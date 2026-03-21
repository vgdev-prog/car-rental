var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();

(function ($, undefined) {
	$(function () {
		let $response = $("#response-dialog"),
			dialog = ($.fn.dialog !== undefined);

		function signatureMobile() {
			var wrapper = document.getElementById("content");
			var clearButton = wrapper.querySelector("[data-action=clear]");
			var changeColorButton = wrapper.querySelector("[data-action=change-color]");
			var undoButton = wrapper.querySelector("[data-action=undo]");
			var savePNGButton = wrapper.querySelector("[data-action=save-png]");
			var saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
			var saveSVGButton = wrapper.querySelector("[data-action=save-svg]");

			var saveSignatureButton = wrapper.querySelector("#save-signature");
			var canvas = document.getElementById("canvas") || null;
			var canvas2 = document.getElementById("canvas2") || null;

			if(!canvas) return;

			signaturePad = new SignaturePad(canvas, {
				// backgroundColor: 'rgb(255, 255, 255)'
			});


			function resizeCanvas() {
				var ratio =  Math.max(window.devicePixelRatio || 1, 1);

				canvas.width = canvas.offsetWidth * ratio;
				canvas.height = canvas.offsetHeight * ratio;
				canvas.getContext("2d").scale(ratio, ratio);
				var ctx = canvas.getContext("2d");
				var image = new Image();
				var image_width = canvas.offsetWidth;
				var image_height = canvas.offsetHeight;
				backgroundLine(canvas);
				resizeCanvas2();
				image.onload = function() {
					ctx.drawImage(image, 0, 0, image_width, image_height);
					ctx.globalCompositeOperation='destination-over';
				};
				image.src = document.querySelector(".signature").value;


			}
			function resizeCanvas2() {
				var ratio =  Math.max(window.devicePixelRatio || 1, 1);
				canvas2.width = canvas2.offsetWidth * ratio;
				canvas2.height = canvas2.offsetHeight * ratio;
				console.log('RR2',canvas2);
				canvas2.getContext("2d").scale(ratio, ratio);
				backgroundLine(canvas2);
			}

			window.onresize = resizeCanvas;
			resizeCanvas();

			function download(dataURL, filename) {
				return;
				if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
					window.open(dataURL);
				} else {
					var blob = dataURLToBlob(dataURL);
					var url = window.URL.createObjectURL(blob);

					var a = document.createElement("a");
					a.style = "display: none";
					a.href = url;
					a.download = filename;

					document.body.appendChild(a);
					a.click();

					window.URL.revokeObjectURL(url);
				}
			}


			function dataURLToBlob(dataURL) {
				var parts = dataURL.split(';base64,');
				var contentType = parts[0].split(":")[1];
				var raw = window.atob(parts[1]);
				var rawLength = raw.length;
				var uInt8Array = new Uint8Array(rawLength);

				for (var i = 0; i < rawLength; ++i) {
					uInt8Array[i] = raw.charCodeAt(i);
				}

				return new Blob([uInt8Array], { type: contentType });
			}

			clearButton.addEventListener("click", function (event) {
				signaturePad.clear();
				backgroundLine(canvas);
			});

			undoButton.addEventListener("click", function (event) {
				var data = signaturePad.toData();
				if (data) {
					data.pop();
					signaturePad.fromData(data);
				}
				backgroundLine(canvas);
			});

			function saveBlob() {
					if (canvas.toDataURL() == canvas2.toDataURL()) {
						alert("Please provide a signature first.");
					} else {
						document.querySelector(".signature").value = signaturePad.toDataURL('image/png');
					}
			}

			function backgroundLine(canvas){
				var ctx = canvas.getContext("2d");
				ctx.beginPath();
				ctx.moveTo(0, 100);
				ctx.lineTo(700, 100);
				ctx.lineWidth = 3;
				ctx.compositeOperation='destination-over';
				ctx.stroke();
			}
			 saveSignatureButton.addEventListener("click", saveBlob);
			return signaturePad;
		}

		signatureMobile();

		if ($response.length > 0 && dialog) {
			$response.dialog({
				modal: true,
				autoOpen: false,
				resizable: false,
				draggable: false,
				open: function () {
					$response.html($response.data("text"));
				}
			});
		}

		$("#save-signature").on("click", function(e) {
			e.preventDefault();
			let token = $('input[name=token]').val();
			let signature = $('input[name=signature]').val();
			if (!window.signaturePad.isEmpty()){
				$.ajax({
					type: "POST",
					url: "index.php?controller=pjAppController&action=pjActionSaveSignature",
					data: {
						token: token,
						signature: signature
					},
					error: function (error) {
						console.error(error)
					},
					success: function (response) {
						window.location.href = 'index.php?controller=pjAppController&action=pjActionSuccess';
					}
				});
			}

		});



	});
})(jQuery_1_8_2);
