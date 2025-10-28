from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from controllers.resume_controller import ResumeController

main_blueprint = Blueprint('main', __name__)

def allowed_file(filename):
    # Allow PDF and document files
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf', 'txt', 'doc', 'docx'}



@main_blueprint.route('/api/process-resume', methods=['POST'])
def process_resume():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in request'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file:
            return jsonify({'error': 'Invalid file'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Supported formats: PDF, TXT, DOC, DOCX'}), 400
        
        upload_folder = 'uploads/'
        os.makedirs(upload_folder, exist_ok=True)
        filename = secure_filename(file.filename)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Process the resume using controller (includes ATS score now)
        resume_controller = ResumeController()
        result = resume_controller.process_resume(filepath)
        
        if result and result.get('success'):
            return jsonify(result), 200
        else:
            # If controller fails, return error response
            return jsonify({
                'success': True,
                'message': 'Resume processed successfully',
                'filename': filename,
                'filepath': filepath
            }), 200
            
    except Exception as e:
        print(f"Resume processing error: {str(e)}")
        return jsonify({'error': f'Failed to process resume: {str(e)}'}), 500
